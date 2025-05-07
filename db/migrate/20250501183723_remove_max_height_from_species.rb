class RemoveMaxHeightFromSpecies < ActiveRecord::Migration[7.2]
  def change
    remove_column :species, :max_height, :float
  end
end
