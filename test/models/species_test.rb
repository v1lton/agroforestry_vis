require "test_helper"

class SpeciesTest < ActiveSupport::TestCase
  test "scientific name can't be empty" do
    species = Species.new
    species.common_names.build(common_name: "Cashew")

    assert_not species.valid?
    assert_equal "Scientific name can't be blank", species.errors.full_messages.to_sentence
  end

  test "must have at least one common name" do
    species = Species.new(scientific_name: "Mangifera indica")

    assert_not species.valid?
    assert_equal "Common names can't be blank. At least one should be added", species.errors.full_messages.to_sentence
  end

  test "species is valid with a scientific name and one common name" do
    species = Species.new(scientific_name: "Mangifera indica")
    species.common_names.build(common_name: "Mango")

    assert species.valid?
  end

  test "species is invalid if common names are removed" do
    species = Species.new(scientific_name: "Mangifera indica")
    species.common_names.build(common_name: "Mango")

    species.common_names.destroy_all

    assert_not species.valid?
    assert_equal "Common names can't be blank. At least one should be added", species.errors.full_messages.to_sentence
  end

  test "species should allow multiple common names" do
    species = Species.new(scientific_name: "Mangifera indica")
    species.common_names.build(common_name: "Mango")
    species.common_names.build(common_name: "Mangga")

    assert species.valid?
  end
end
