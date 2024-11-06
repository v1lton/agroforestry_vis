class AddNotNullConstraintToCommonName < ActiveRecord::Migration[7.2]
  def change
    change_column_null :species_common_names, :common_name, false
  end
end
