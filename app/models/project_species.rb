# frozen_string_literal: true

class ProjectSpecies < ApplicationRecord
  belongs_to :project
  belongs_to :species
end