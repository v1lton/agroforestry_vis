# frozen_string_literal: true

require "csv"

# Reads and parses the seed in ".csv" format.
csv_text = File.read(Rails.root.join("db", "seeds", "seed.csv"))
csv = CSV.parse(csv_text, headers: true, encoding: "UTF-8")

# Iterate through each row
csv.each do |row|
  # Find or initialize a species by scientific name
  species = Species.find_or_initialize_by(scientific_name: row["scientific_name"])

  unless species.common_names.exists?(common_name: row["common_name"])
    species.common_names.build(common_name: row["common_name"])
  end

  species.update(
    layer: case row["layer"]
           when "baixo" then :low_layer
           when "médio" then :medium_layer
           when "alto" then :high_layer
           when "emergente" then :emergent_layer
           end,
    start_crop_time: row["start_crop_time"],
    end_crop_time: row["end_crop_time"],
    spacing: row["spacing"],
  )

  species.save!
end
