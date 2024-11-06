class CreateSpeciesParameters < ActiveRecord::Migration[7.2]
  def change
    create_table :species_parameters do |t|
      t.references :species, null: false, foreign_key: true
      t.references :species_function, null: false, foreign_key: true
      t.integer :layer
      t.float :first_crop_time
      t.float :productive_life
      t.float :max_height
      t.float :spacing
      t.boolean :accepts_pruning
      t.integer :fertility_requirement
      t.integer :water_requirement

      t.timestamps
    end

    # Ensure a species can only have one set of parameters per function
    add_index :species_parameters, [:species_id, :species_function_id], unique: true
  end
end
