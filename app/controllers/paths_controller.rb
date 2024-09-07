require 'net/http'
require 'json'
require 'uri'

class PathsController < ApplicationController
  def fetch
    path_values = params[:path_values]
    path = path_values.join('|')
    url = URI.parse("https://roads.googleapis.com/v1/snapToRoads?path=#{path}&interpolate=true&key=#{ENV["MAP_API_KEY"]}")
    response = Net::HTTP.get_response(url)
    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      # 必要に応じてデータを加工し、フロントエンドに返す
      render json: { snappedPoints: data['snappedPoints'] }
    else
      # エラーレスポンスの場合
      render json: { error: 'Failed to fetch data from API' }, status: response.code.to_i
    end
  end
end
