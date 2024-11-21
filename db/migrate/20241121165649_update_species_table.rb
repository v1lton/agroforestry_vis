class UpdateSpeciesTable < ActiveRecord::Migration[7.2]
  def change
    remove_index :species, :scientific_name if index_exists?(:species, :scientific_name, unique: true)

    change_table :species, bulk: true do |t|
      t.integer :layer
      t.float :start_crop_time
      t.float :end_crop_time
    end
  end
end
