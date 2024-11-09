# frozen_string_literal: true

json.id species.id
json.type "Species"
json.scientific_name species.scientific_name

# Common names.
json.commmon_names species.common_names do |common_name|
  json.name common_name.common_name
end

# Set of functions.
json.functions species.functions.uniq do |function|
  json.name function.name

  # Parameters for this function
  parameter = species.parameters.find_by(species_function: function)
  if parameter
    json.parameters do
      json.layer parameter.layer
      json.first_crop_time parameter.first_crop_time
      json.productive_life parameter.productive_life
      json.max_height parameter.max_height
      json.spacing parameter.spacing
      json.water_requirement parameter.water_requirement
      json.fertility_requirement parameter.fertility_requirement
      json.accepts_pruning parameter.accepts_pruning
    end
  end
end
