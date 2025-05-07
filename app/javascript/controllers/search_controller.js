import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["searchBar", "results", "list"]

  static values = {
    items: Array
  }

  addItemToList(event) {
    const params = event.params

    const container = document.createElement("div");
    container.className = "list-group-item"

    const name = document.createElement("span");
    name.textContent = params.name;
    container.appendChild(name);

    const button = document.createElement("button");
    button.textContent = "+";
    button.setAttribute("data-action", "canvas#addSpecies")
    button.setAttribute("data-canvas-name-param", params.name)
    button.setAttribute("data-canvas-layer-param", params.layer)
    button.setAttribute("data-canvas-spacing-param", params.spacing)
    button.setAttribute("data-canvas-start-param", params.start)
    button.setAttribute("data-canvas-end-param", params.end)

    container.appendChild(button);
    this.listTarget.appendChild(container);

    // Clear results
    this.resultsTarget.innerHTML = "";
    this.resultsTarget.hidden = true;
  }

  filter(event) {
    const input = event.target.value.toLowerCase();
    this.resultsTarget.innerHTML =  "";
    this.resultsTarget.hidden = true;
    if (input.length < 3) return;

    // TODO: be accents insensitive
    const filtered = this.itemsValue.filter(item => item.name.toLowerCase().includes(input));
    if (filtered.length === 0) return;

    filtered.forEach(item => {
      const listElement = document.createElement("li");
      listElement.innerText = item.name;
      listElement.className = "list-group-item list-group-item-action";
      // Set action and the associated params
      listElement.setAttribute("data-action", "click->search#addItemToList")
      listElement.setAttribute("data-search-name-param", item.name)
      listElement.setAttribute("data-search-layer-param", item.layer)
      listElement.setAttribute("data-search-spacing-param", item.spacing)
      listElement.setAttribute("data-search-start-param", item.start)
      listElement.setAttribute("data-search-end-param", item.end)

      this.resultsTarget.appendChild(listElement);
    });

    this.resultsTarget.hidden = false;
  }
}
