import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout user={auth.user} header="Perfil">
            <Head title="Perfil" />

            <div className="page-wrap">
                <div className="page-container space-y-5">
                    <section className="panel p-5 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </section>

                    <section className="panel p-5 sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </section>

                    <section className="panel p-5 sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
