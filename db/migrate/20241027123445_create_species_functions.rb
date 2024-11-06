class CreateSpeciesFunctions < ActiveRecord::Migration[7.2]
  def change
    create_table :species_functions do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :species_functions, :name, unique: true
  end
end
