# frozen_string_literal: true

module Api
  class ProjectResourcesController < Api::BaseController
    before_action :authenticate_admin_or_manager_or_leader!
    respond_to :json

    def index
      if params[:selected_users].present?
        selected_users = params[:selected_users].split(',')
        @project_resources = ProjectResource.where('user_id IN (?) OR group_only = ?', selected_users, true)
      else
        @project_resources = ProjectResource.all
      end
      respond_with @project_resources
    end

    def create
      @project_resource = ResourcesService.new.call(project_resource_params)
      respond_with @project_resource
    end

    def destroy
      @project_resource = ProjectResource.find_by(rid: params[:id])
      @project_resource.destroy
      respond_with @project_resource
    end

    private

    def project_resource_params
      params.fetch(:resource).permit(:name, :group_only, :parent_rid, :user_id)
    end
  end
end