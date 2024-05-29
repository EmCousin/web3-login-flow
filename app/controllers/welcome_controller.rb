class WelcomeController < ApplicationController
  include PublicController

  before_action :authenticate

  def index; end
end
