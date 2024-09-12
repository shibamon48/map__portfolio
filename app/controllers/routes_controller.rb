require 'google_maps_service/polyline' 

class RoutesController < ApplicationController
  skip_before_action :require_login, only: %i[ new ]

  def new
    @user = current_user
    gon.map_api_key = ENV["MAP_API_KEY"]

    routes = Route.all
    pathValues = []
    if routes.present?
      routes.each do |route|
        path = GoogleMapsService::Polyline.decode(route.path)
        pathValues.push(path)
      end
      gon.mypathValues = pathValues
    end
  end

  def create
    # {"lat":35.681236, "lng":139.767125}のようなJSON形式を受け取る
    pathValues = params[:_json]
    polylines = []
    latlng = []
    
    pathValues.each do |path|
      latlng = [path["lat"],path["lng"]]
      polylines.push(latlng)
    end
    encoded_path = GoogleMapsService::Polyline.encode(polylines)

    path = Route.new(path: encoded_path)
    path.save!
  end

  private
  def route_params
    params.permit(:_json)
  end

end
