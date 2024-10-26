class Species < ApplicationRecord

  has_many :common_names, class_name: "SpeciesCommonName", inverse_of: :species, dependent: :destroy

  validates_presence_of :scientific_name
  validates :common_names, length: { minimum: 1, message: "can't be blank. At least one should be added" }

  accepts_nested_attributes_for :common_names, allow_destroy: true
end
