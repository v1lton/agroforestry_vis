class Species < ApplicationRecord

  has_many :common_names, class_name: "SpeciesCommonName", inverse_of: :species, dependent: :destroy

  validates_presence_of :scientific_name
end
