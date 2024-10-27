require "test_helper"

class SpeciesFunctionTest < ActiveSupport::TestCase
  setup do
    @avocado_fruit_function = species_functions(:avocado_fruit)
  end

  test "is invalid without parameters associated" do
    @avocado_fruit_function.species_parameter = nil

    assert_not @avocado_fruit_function.valid?
    assert_equal "Species parameter can't be blank", @avocado_fruit_function.errors.full_messages.to_sentence
  end
end
