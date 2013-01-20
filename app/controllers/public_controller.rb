require 'net/http'

class PublicController < ApplicationController
  def index

  end

  def spotify_image
    url_contents = Net::HTTP.get(URI.parse(params[:url]))
    thumbnail = url_contents.to_s.scan(/<meta property=\"og:image\" content=\"([^\"]*)\">/)

    render :text => thumbnail[0][0]
  end
end
