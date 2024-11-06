# frozen_string_literal: true

require "csv"

# Reads and parses the seed in ".csv" format.
csv_text = File.read(Rails.root.join("db", "seeds", "seed.csv"))
csv = CSV.parse(csv_text, headers: true, encoding: "UTF-8")

# Iterate through each row
csv.each do |row|
  # Find or create the species function
  species_function = SpeciesFunction.find_or_create_by(name: row["function"])

  # Find or initialize a species by scientific name
  species = Species.find_or_initialize_by(scientific_name: row["scientific_name"])

  # Only add the common name if it doesn’t already exist in the species
  unless species.common_names.exists?(common_name: row["common_name"])
    species.common_names.build(common_name: row["common_name"])
  end

  # Check if a parameter with the species function already exists
  unless species.parameters.exists?(species_function: species_function)
    species.parameters.build(
      species_function: species_function,
      layer: case row["layer"]
             when "baixo" then :low_layer
             when "médio" then :medium_layer
             when "alto" then :high_layer
             when "emergente" then :emergent_layer
             end,
      water_requirement: case row["water_requirement"]
                         when "baixa" then :low_water
                         when "média" then :medium_water
                         when "alta" then :high_water
                         end,
      fertility_requirement: case row["fertility_requirement"]
                             when "baixa" then :low_fertility
                             when "média" then :medium_fertility
                             when "alta" then :high_fertility
                             end,
      accepts_pruning: row["accepts_pruning"] == "Sim",
      first_crop_time: row["first_crop_time"],
      productive_life: row["productive_life"],
      max_height: row["max_height"],
      spacing: row["spacing"]
    )
  end

  # Save the species along with associated common names and parameters
  species.save!
end
