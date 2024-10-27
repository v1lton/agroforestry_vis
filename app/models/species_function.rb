class SpeciesFunction < ApplicationRecord
  has_many :species_parameters
  has_many :species, through: :species_parameters

  validates :name, presence: true, uniqueness: true

  scope :ordered, -> { order(:name) }
end
