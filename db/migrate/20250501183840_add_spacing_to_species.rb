class AddSpacingToSpecies < ActiveRecord::Migration[7.2]
  def change
    add_column :species, :spacing, :float, null: false
  end
end
