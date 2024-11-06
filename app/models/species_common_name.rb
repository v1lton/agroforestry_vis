class SpeciesCommonName < ApplicationRecord

  belongs_to :species

  validates_presence_of :common_name
end
