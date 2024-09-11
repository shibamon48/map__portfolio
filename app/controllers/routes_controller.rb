class RoutesController < ApplicationController
  def new
    gon.map_api_key = ENV["MAP_API_KEY"]

    route = Route.all
    pathValues = []
    if route.present?
      maps.each do |map|
        path = GoogleMapsService::Polyline.decode(map.encorded_path)
        pathValues.push(path)
      end
      gon.mypathValues = pathValues
    end
  end

  def create
    # {"lat":35.681236, "lng":139.767125}のようなJSON形式を受け取る
    pathValues = JSON.parse(route_params)
    polylines = []
    latlng = []
    


    pathValues.each do |path|
      latlng = [path["lat"],path["lng"]]
      polylines.push(latlng)
    end
    encoded_path = Polylines::Encoder.encode(polylines)

    path = Route.new(path: encoded_path)
    path.save
  end

  private
  def route_params
    params.permit(_json: [:lat, :lng])
  end

end
