require "test_helper"

class SpeciesCommonNameTest < ActiveSupport::TestCase
  setup do
    @cashew_species = species(:cashew)
    @cashew_name = species_common_names(:cashew_name)
  end

  test "needs to belong to a species" do
    cashew_name = SpeciesCommonName.new(common_name: "Cashew")

    assert_not cashew_name.valid?
    assert_equal "Species must exist", cashew_name.errors.full_messages.to_sentence
  end

  test "common name is destroyed when deleting a species" do
    assert_equal @cashew_species, @cashew_name.species

    assert_difference("SpeciesCommonName.count", -1) do
      @cashew_species.destroy
    end

    assert_nil SpeciesCommonName.find_by(id: @cashew_name.id)
  end

  test "common_name can't be empty" do
    cashew_name = @cashew_species.common_names.new

    assert_not cashew_name.valid?
    assert_equal "Common name can't be blank", cashew_name.errors.full_messages.to_sentence
  end
end
