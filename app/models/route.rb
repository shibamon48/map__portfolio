class Route < ApplicationRecord
  has_many :exploration_routes, dependent: :destroy
  has_many :users, through: :exploration_routes
end
