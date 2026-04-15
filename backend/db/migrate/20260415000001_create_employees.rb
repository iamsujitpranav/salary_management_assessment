class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :job_title, null: false
      t.string :department, null: false
      t.string :country, null: false
      t.string :email, null: false
      t.decimal :salary, precision: 12, scale: 2, null: false
      t.string :currency, null: false, default: "USD"
      t.string :employment_type, null: false, default: "full_time"
      t.date :hired_on, null: false
      t.string :status, null: false, default: "active"
      t.tsvector :search_vector

      t.timestamps
    end

    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, :status
    add_index :employees, :search_vector, using: :gin

    execute <<~SQL
      CREATE FUNCTION employees_search_vector_update() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector(
          'english',
          coalesce(NEW.first_name, '') || ' ' ||
          coalesce(NEW.last_name, '') || ' ' ||
          coalesce(NEW.job_title, '') || ' ' ||
          coalesce(NEW.department, '') || ' ' ||
          coalesce(NEW.country, '') || ' ' ||
          coalesce(NEW.email, '') || ' ' ||
          coalesce(NEW.status, '')
        );
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER employees_search_vector_trigger
      BEFORE INSERT OR UPDATE ON employees
      FOR EACH ROW EXECUTE FUNCTION employees_search_vector_update();
    SQL
  end
end
