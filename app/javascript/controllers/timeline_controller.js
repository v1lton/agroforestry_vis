// timeline_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["svg", "functionSelect"]

  connect() {
    // Initialize the SVG container with some basic styling
    this.svg = d3.select(this.svgTarget)
    this.margin = { top: 50, right: 50, bottom: 50, left: 200 }
    this.width = this.svgTarget.clientWidth - this.margin.left - this.margin.right
    this.height = this.svgTarget.clientHeight - this.margin.top - this.margin.bottom

    // Create the main group element with margins
    this.g = this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`)

    // Create scales (will be updated with data)
    this.xScale = d3.scaleLinear()
    this.yScale = d3.scaleBand().padding(0.1)

    // Add axes groups
    this.xAxis = this.g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${this.height})`)

    this.yAxis = this.g.append("g")
      .attr("class", "y-axis")

    // Add labels
    this.svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this.margin.left + this.width / 2)
      .attr("y", this.height + this.margin.top + 40)
      .text("Years")

    // If there's a pre-selected function, load its data
    if (this.functionSelectTarget.value) {
      this.loadData()
    } else {
      this.showEmptyState()
    }
  }

  async functionChanged() {
    if (this.functionSelectTarget.value) {
      await this.loadData()
    } else {
      this.showEmptyState()
    }
  }

  showEmptyState() {
    // Clear existing elements
    this.g.selectAll(".timeline-bar").remove()

    // Reset scales
    this.xScale.domain([0, 10])
      .range([0, this.width])

    this.yScale.domain([])
      .range([0, this.height])

    // Update axes
    this.xAxis.call(d3.axisBottom(this.xScale))
    this.yAxis.call(d3.axisLeft(this.yScale))

    // Add empty state message
    this.g.append("text")
      .attr("class", "empty-state")
      .attr("x", this.width / 2)
      .attr("y", this.height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text("Select a function to view timeline")
  }

  async loadData() {
    // Remove empty state message if it exists
    this.g.selectAll(".empty-state").remove()

    // Fetch data for the selected function
    const response = await fetch(`/species_functions/timeline.json?species_function_id=${this.functionSelectTarget.value}`)
    const data = await response.json()

    // Process the data
    const timelineData = data.map(d => ({
      species: d.species_scientific_name,
      start: d.first_crop_time,
      duration: d.productive_life
    }))

    // Update scales
    const maxTime = d3.max(timelineData, d => d.start + d.duration)
    this.xScale.domain([0, maxTime])
      .range([0, this.width])

    this.yScale.domain(timelineData.map(d => d.species))
      .range([0, this.height])

    // Update axes
    this.xAxis.transition().duration(500)
      .call(d3.axisBottom(this.xScale))

    this.yAxis.transition().duration(500)
      .call(d3.axisLeft(this.yScale))

    // Data join for timeline bars
    const bars = this.g.selectAll(".timeline-bar")
      .data(timelineData)

    // Remove old bars
    bars.exit().remove()

    // Add new bars
    const barsEnter = bars.enter()
      .append("rect")
      .attr("class", "timeline-bar")

    // Update all bars
    bars.merge(barsEnter)
      .transition()
      .duration(500)
      .attr("x", d => this.xScale(d.start))
      .attr("y", d => this.yScale(d.species))
      .attr("width", d => this.xScale(d.duration) - this.xScale(0))
      .attr("height", this.yScale.bandwidth())
      .attr("fill", "#2196F3")
      .attr("opacity", 0.7)

    // Add tooltips
    bars.merge(barsEnter)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1)

        this.g.append("text")
          .attr("class", "tooltip")
          .attr("x", this.xScale(d.start + d.duration / 2))
          .attr("y", this.yScale(d.species) - 5)
          .attr("text-anchor", "middle")
          .text(`Start: Year ${d.start}, Duration: ${d.duration} years`)
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.7)
        this.g.selectAll(".tooltip").remove()
      })
  }
}