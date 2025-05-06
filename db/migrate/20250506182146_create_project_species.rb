class CreateProjectSpecies < ActiveRecord::Migration[7.2]
  def change
    create_table :project_species do |t|
      t.references :project, null: false, foreign_key: true
      t.references :species, null: false, foreign_key: true

      t.timestamps
    end
  end
end
