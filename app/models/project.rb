class Project < ApplicationRecord
  has_many :project_species, class_name: "ProjectSpecies", dependent: :destroy
  has_many :species, through: :project_species

  accepts_nested_attributes_for :project_species
end
