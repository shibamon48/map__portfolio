class Spot < ApplicationRecord
  belongs_to :user
  has_one_attached :photo

  def as_json(options = {})
    # 既存の JSON データに加えて、photo_url を追加
    super(options).merge(photo_url: photo.attached? ? Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true) : nil)
  end
end
