# frozen_string_literal: true

class SpeciesFunction < ApplicationRecord
  has_many :species_parameters, dependent: :destroy
  has_many :species, through: :species_parameters

  validates :name, presence: true, uniqueness: true

  scope :ordered, -> { order(:name) }
end
