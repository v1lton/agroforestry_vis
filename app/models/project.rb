class Project < ApplicationRecord
  has_many :project_species
  has_many :species, through: :project_species
end
