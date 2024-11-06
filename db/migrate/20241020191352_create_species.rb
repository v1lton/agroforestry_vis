class CreateSpecies < ActiveRecord::Migration[7.2]
  def change
    create_table :species do |t|
      t.string :scientific_name

      t.timestamps
    end
  end
end
