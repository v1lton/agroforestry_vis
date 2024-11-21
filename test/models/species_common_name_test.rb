require "test_helper"

class SpeciesCommonNameTest < ActiveSupport::TestCase
  setup do
    @avocado_species = species(:avocado_species)
    @avocado_name= species_common_names(:avocado_name)
  end

  test "needs to belong to a species" do
    cashew_name = SpeciesCommonName.new(common_name: "Cashew")

    assert_not cashew_name.valid?
    assert_equal "Species must exist", cashew_name.errors.full_messages.to_sentence
  end

  test "common name is destroyed when deleting a species" do
    assert_equal @avocado_species, @avocado_name.species

    assert_difference("SpeciesCommonName.count", -1) do
      @avocado_species.destroy
    end

    assert_nil SpeciesCommonName.find_by(id: @avocado_species.id)
  end

  test "common_name can't be empty" do
    avocado_name = @avocado_species.common_names.new

    assert_not avocado_name.valid?
    assert_equal "Common name can't be blank", avocado_name.errors.full_messages.to_sentence
  end
end
