module ApplicationHelper
  def current_page_ok?(controller_name, action_name)
    controller_name == "routes" && action_name == "new" || controller_name == "users" && action_name == "edit"
  end
end
