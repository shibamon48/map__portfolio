class MapsController < ApplicationController
  def new
    gon.map_api_key = ENV['MAP_API_KEY']
  end
end
