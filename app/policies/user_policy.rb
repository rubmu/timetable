# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def permitted_attributes
    user.admin? ? admin_params : params
  end

  private

  def params
    %i[first_name last_name lang position_list]
  end

  def admin_params
    params + [:email, :phone, :contract_name, :active, :birthdate, position_list: []]
  end
end
