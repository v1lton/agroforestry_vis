# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_10_27_123501) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "species", force: :cascade do |t|
    t.string "scientific_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "species_common_names", force: :cascade do |t|
    t.string "common_name", null: false
    t.bigint "species_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["species_id"], name: "index_species_common_names_on_species_id"
  end

  create_table "species_functions", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_species_functions_on_name", unique: true
  end

  create_table "species_parameters", force: :cascade do |t|
    t.bigint "species_id", null: false
    t.bigint "species_function_id", null: false
    t.integer "layer"
    t.float "first_crop_time"
    t.float "productive_life"
    t.float "max_height"
    t.float "spacing"
    t.boolean "accepts_pruning"
    t.integer "fertility_requirement"
    t.integer "water_requirement"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["species_function_id"], name: "index_species_parameters_on_species_function_id"
    t.index ["species_id", "species_function_id"], name: "index_species_parameters_on_species_id_and_species_function_id", unique: true
    t.index ["species_id"], name: "index_species_parameters_on_species_id"
  end

  add_foreign_key "species_common_names", "species"
  add_foreign_key "species_parameters", "species"
  add_foreign_key "species_parameters", "species_functions"
end
