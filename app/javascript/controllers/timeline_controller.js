import { Controller } from "@hotwired/stimulus"
// import * as d3 from "d3"
import { select } from "d3"

export default class extends Controller {
  static targets = ["functionSelect", "svg"]

  connect() {
    console.log(select)
    // this.svg = d3.select(this.svgTarget)
    // this.width = +this.svg.attr("width")
    // this.height = +this.svg.attr("height")
    // this.margin = { top: 20, right: 20, bottom: 30, left: 150 }
    // this.innerWidth = this.width - this.margin.left - this.margin.right
    // this.innerHeight = this.height - this.margin.top - this.margin.bottom
    //
    // // Create a group element to hold the chart elements
    // this.chartGroup = this.svg.append("g")
    //   .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
    //
    // // Initialize scales and axes
    // this.xScale = d3.scaleLinear()
    //   .range([0, this.innerWidth])
    //
    // this.yScale = d3.scaleBand()
    //   .range([0, this.innerHeight])
    //   .padding(0.1)
    //
    // this.xAxisGroup = this.chartGroup.append("g")
    //   .attr("transform", `translate(0,${this.innerHeight})`)
    //
    // this.yAxisGroup = this.chartGroup.append("g")
  }

  functionChanged() {
    const functionId = this.functionSelectTarget.value
    if (functionId) {
      d3.json(`/species_timeline.json?function_id=${functionId}`)
        .then(data => {
          this.updateChart(data)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    } else {
      // Clear the chart if no function is selected
      this.chartGroup.selectAll(".bar").remove()
      this.xAxisGroup.call(d3.axisBottom(this.xScale))
      this.yAxisGroup.call(d3.axisLeft(this.yScale))
    }
  }

  updateChart(data) {
    // Process the data
    data.forEach(d => {
      d.first_crop_time = +d.first_crop_time || 0
      d.productive_life = +d.productive_life || 0
      d.start = d.first_crop_time
      d.end = d.first_crop_time + d.productive_life
      d.species_name = d.species_name
    })

    // Update scales
    const xMax = d3.max(data, d => d.end) || 0
    this.xScale.domain([0, xMax])
    this.yScale.domain(data.map(d => d.species_name))

    // Update axes
    this.xAxisGroup.call(d3.axisBottom(this.xScale))
    this.yAxisGroup.call(d3.axisLeft(this.yScale))

    // Bind data to bars
    const bars = this.chartGroup.selectAll(".bar")
      .data(data, d => d.species_name)

    // Remove old bars
    bars.exit().remove()

    // Update existing bars
    bars.attr("x", d => this.xScale(d.start))
      .attr("width", d => this.xScale(d.end) - this.xScale(d.start))
      .attr("y", d => this.yScale(d.species_name))
      .attr("height", this.yScale.bandwidth())

    // Add new bars
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => this.xScale(d.start))
      .attr("width", d => this.xScale(d.end) - this.xScale(d.start))
      .attr("y", d => this.yScale(d.species_name))
      .attr("height", this.yScale.bandwidth())
      .attr("fill", "steelblue")
  }
}