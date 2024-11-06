# frozen_string_literal: true

class SpeciesParameter < ApplicationRecord
  belongs_to :species
  belongs_to :species_function

  validates :species_function_id, uniqueness: { scope: :species_id,
                                                message: "already has parameters for this function" }

  enum :layer, [
    :low_layer,
    :medium_layer,
    :high_layer,
    :emergent_layer
  ]

  enum :fertility_requirement, [
    :low_fertility,
    :medium_fertility,
    :high_fertility
  ]

  enum :water_requirement, [
    :low_water,
    :medium_water,
    :high_water
  ]

  after_destroy :destroy_species_if_no_parameters

  private

  # Destroys associated species if it has no associated parameter
  # after destroying parameter.
  #
  # Species should have at least one set of parameters. If any is left,
  # then it should be deleted.
  def destroy_species_if_no_parameters
    if species.parameters.count.zero?
      species.destroy
    end
  end
end
