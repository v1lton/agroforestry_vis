class AddMaxHeightToSpecies < ActiveRecord::Migration[7.2]
  def change
    add_column :species, :max_height, :float
  end
end
