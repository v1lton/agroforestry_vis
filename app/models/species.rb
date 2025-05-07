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
end
