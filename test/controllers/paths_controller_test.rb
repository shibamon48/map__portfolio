require "test_helper"

class PathsControllerTest < ActionDispatch::IntegrationTest
  test "should get fetch" do
    get paths_fetch_url
    assert_response :success
  end
end
