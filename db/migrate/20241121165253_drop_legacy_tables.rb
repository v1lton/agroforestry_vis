class DropLegacyTables < ActiveRecord::Migration[7.2]
  def change
    # Remove the foreign keys before dropping the tables
    remove_foreign_key :species_parameters, :species_functions if foreign_key_exists?(:species_parameters, :species_functions)
    remove_foreign_key :species_parameters, :species if foreign_key_exists?(:species_parameters, :species)

    drop_table :species_functions, if_exists: true
    drop_table :species_parameters, if_exists: true
  end
end
