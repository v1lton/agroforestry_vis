# frozen_string_literal: true

class Species < ApplicationRecord
  has_many :common_names, class_name: "SpeciesCommonName", inverse_of: :species, dependent: :destroy

  accepts_nested_attributes_for :common_names, allow_destroy: true

  validates_presence_of :scientific_name
  validates_presence_of :common_names

  enum :layer, [
    :low_layer,
    :medium_layer,
    :high_layer,
    :emergent_layer
  ]
end
