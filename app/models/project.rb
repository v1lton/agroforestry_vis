class Project < ApplicationRecord
  has_many :project_species, class_name: "ProjectSpecies", dependent: :destroy
  has_many :species, through: :project_species

  accepts_nested_attributes_for :project_species

  validates :row_spacing, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    message: "Espaçamento entre linhas deve ter pelo menos 1 metro."
  }
end
