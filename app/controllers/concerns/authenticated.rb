# frozen_string_literal: true

module Authenticated
  extend ActiveSupport::Concern

  protected

  def authenticate_unless_signed_in!
    authenticate! { filter_already_signed_in! }
  end

  def filter_already_signed_in!
    redirect_to :root, notice: t('auth.failure.already_authenticated') if Current.user
  end
end
