class CreateSpeciesCommonNames < ActiveRecord::Migration[7.2]
  def change
    create_table :species_common_names do |t|
      t.string :common_name
      t.references :species, null: false, foreign_key: true

      t.timestamps
    end
  end
end
