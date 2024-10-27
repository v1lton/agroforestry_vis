class Species < ApplicationRecord
  has_many :common_names, class_name: "SpeciesCommonName", inverse_of: :species, dependent: :destroy
  has_many :parameters, class_name: "SpeciesParameter", inverse_of: :species, dependent: :destroy
  has_many :functions, through: :parameters, source: :species_function

  accepts_nested_attributes_for :common_names, allow_destroy: true
  accepts_nested_attributes_for :parameters, allow_destroy: true

  validates_presence_of :scientific_name, uniqueness: true
  validates_presence_of :common_names
  validates_presence_of :parameters

  # Add validation to ensure parameters have unique functions
  validate :no_duplicate_functions

  private

  def no_duplicate_functions
    function_ids = parameters.map(&:species_function_id)
    if function_ids.compact.uniq.length != function_ids.compact.length
      errors.add(:base, "Cannot have multiple parameter sets for the same function")
    end
  end
end
