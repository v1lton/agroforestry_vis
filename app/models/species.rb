# frozen_string_literal: true

class Species < ApplicationRecord
  has_many :project_species, class_name: "ProjectSpecies"
  has_many :projects, through: :project_species

  has_many :common_names, class_name: "SpeciesCommonName", inverse_of: :species, dependent: :destroy

  accepts_nested_attributes_for :common_names, allow_destroy: true

  validates_presence_of :scientific_name
  validates_presence_of :common_names
  validates :layer, presence: true

  enum :layer, [
    :low_layer,
    :medium_layer,
    :high_layer,
    :emergent_layer
  ]

  def name
    common_name = common_names.first.common_name

    if common_name
      return common_name
    else
      return scientific_name
    end
  end

  def layer_name
    case layer
    when 'emergent_layer'
      'Emergente'
    when 'high_layer'
      'Alto'
    when 'medium_layer'
      'Médio'
    when 'low_layer'
      'Baixo'
    else
      layer
    end
  end

  def layer_color
    case layer
    when 'emergent_layer'
      'blue'
    when 'high_layer'
      'green'
    when 'medium_layer'
      'yellow'
    when 'low_layer'
      'red'
    else
      'gray'
    end
  end

  def production_description
    start = start_crop_time
    end_ = end_crop_time

    format_number = ->(num) do
      (num % 1).zero? ? num.to_i.to_s : num.to_s.sub('.', ',')
    end

    format_value = ->(value) do
      if value < 1
        months = (value * 12).round
        unit = months == 1 ? "mês" : "meses"
        "#{months} #{unit}"
      else
        years = format_number.call(value)
        unit = value.to_i == 1 && value % 1 == 0 ? "ano" : "anos"
        "#{years} #{unit}"
      end
    end

    if start == end_
      "#{format_value.call(start)} | #{spacing.to_s.sub(".", ",")} #{"metros".pluralize}"
    else
      "#{format_value.call(start)} - #{format_value.call(end_)} | #{spacing.to_s.sub(".", ",")} #{"metros".pluralize}"
    end
  end
end
