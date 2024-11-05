require "test_helper"

class SpeciesFunctionTest < ActiveSupport::TestCase
  test "name can't be empty" do
    function = SpeciesFunction.new

    assert_not function.valid?
    assert_equal "Name can't be blank", function.errors.full_messages.to_sentence
  end
end
