class SpeciesParameter < ApplicationRecord
  belongs_to :species
  belongs_to :species_function

  validates :species_function_id, uniqueness: { scope: :species_id,
                                                message: "already has parameters for this function" }
end
