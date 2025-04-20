# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "fabric", to: "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/662/index.min.js" # @6.6.2
pin "konva", to: "https://unpkg.com/konva@9.3.20/konva.min.js"
