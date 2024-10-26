class AddNotNullConstraintToScientificName < ActiveRecord::Migration[7.2]
  def change
    change_column_null :species, :scientific_name, false
  end
end
